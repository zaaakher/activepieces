import { getAvailablePieceNames } from './utils/get-available-piece-names'
import { publishNxProject } from './utils/publish-nx-project'

const publishPiece = async (type: string, pieceName: string): Promise<void> => {
  console.info(`[publishPiece] pieceName=${pieceName}`)
  const nxProjectPath = `packages/pieces/${type}/${pieceName}`
  await publishNxProject(nxProjectPath)
}

const main = async () => {
  const pieceNames = await getAvailablePieceNames()
  const publishResults = pieceNames.map(p => publishPiece(p.type, p.pieceName))
  await Promise.all(publishResults)
}

main()
