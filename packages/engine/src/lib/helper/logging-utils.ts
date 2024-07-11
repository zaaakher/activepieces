import { isObject, StepOutput } from '@activepieces/shared'
import sizeof from 'object-sizeof'
import PriorityQueue from 'priority-queue-typescript'
import { Queue } from '@datastructures-js/queue';

const TRUNCATION_TEXT_PLACEHOLDER = '(truncated)'
const MAX_SIZE_FOR_ALL_ENTRIES = 1024 * 1024
const SIZE_OF_TRUNCATION_TEXT_PLACEHOLDER = sizeof(TRUNCATION_TEXT_PLACEHOLDER)
const nonTruncatableKeys: Key[] = ['status', 'duration', 'type', 'errorMessage']

export const loggingUtils = {
    async trimExecution(steps: Record<string, StepOutput>): Promise<Record<string, StepOutput>> {
        const totalJsonSize = sizeof(steps)
        if (!jsonExceedMaxSize(totalJsonSize)) {
            return steps
        }
        return removeLeavesInTopologicalOrder(JSON.parse(JSON.stringify(steps)))
    },
}

function removeLeavesInTopologicalOrder(json: Record<string, unknown>): Record<string, StepOutput> {
    const nodes: Node[] = traverseJsonAndConvertToNodes(json)
    const leaves = new PriorityQueue<Node>(
        undefined,
        (a: Node, b: Node) => b.size - a.size,
    )
    nodes.filter((node) => node.numberOfChildren === 0).forEach((node) => leaves.add(node))
    let totalJsonSize = sizeof(json)

    while (!leaves.empty() && jsonExceedMaxSize(totalJsonSize)) {
        const curNode = leaves.poll()

        const isDepthGreaterThanOne = curNode && curNode.depth > 1;
        const isTruncatable = curNode && (!nonTruncatableKeys.includes(curNode.key) || curNode.depth > 2);

        if (isDepthGreaterThanOne && isTruncatable) {
            totalJsonSize += SIZE_OF_TRUNCATION_TEXT_PLACEHOLDER - curNode.size

            const parent = curNode.parent
            
            parent.value[curNode.key] = TRUNCATION_TEXT_PLACEHOLDER
            
            nodes[parent.index].numberOfChildren--
            if (nodes[parent.index].numberOfChildren == 0) {
                leaves.add(nodes[parent.index])
            }
        }
    }
    return json as Record<string, StepOutput>
}

function traverseJsonAndConvertToNodes(root: unknown) {

    const nodesQueue = new Queue<BfsNode>()
    nodesQueue.enqueue({ key: '', value: root, parent: { index: -1, value: {} }, depth: 0 })

    const nodes: Node[] = []

    while (!nodesQueue.isEmpty()) {
        const curNode = nodesQueue.dequeue()
        const children = findChildren(curNode.value)

        nodes.push({
            index: nodes.length,
            size: children.length === 0 ? sizeof(curNode.value) : children.length * SIZE_OF_TRUNCATION_TEXT_PLACEHOLDER,
            key: curNode.key,
            parent: {
                index: curNode.parent.index,
                value: curNode.parent.value as Record<Key, unknown>
            },
            numberOfChildren: children.length,
            depth: curNode.depth
        })

        children.forEach((child) => {
            const key = child[0], value = child[1]
            nodesQueue.enqueue({ value, key, parent: { index: nodes.length - 1, value: curNode.value }, depth: curNode.depth + 1})
        })
    }

    return nodes
}

function findChildren(curNode: unknown): [Key, unknown][] {
    if (isObject(curNode)) {
        return Object.entries(curNode)
    }
    if (Array.isArray(curNode)) {
        const children: [Key, unknown][] = []
        for (let i = 0; i < curNode.length; i++) {
            children.push([i, curNode[i]])
        }
        return children
    }
    return []
}

const jsonExceedMaxSize = (jsonSize: number): boolean => {
    return jsonSize > MAX_SIZE_FOR_ALL_ENTRIES
}

type Node = {
    index: number
    size: number
    key: Key
    parent: {
        index: number
        value: Record<Key, unknown>
    }
    numberOfChildren: number
    depth: number
}

type BfsNode = {
    value: unknown
    key: Key
    parent: {
        index: number
        value: unknown
    }
    depth: number
}

type Key = string | number | symbol