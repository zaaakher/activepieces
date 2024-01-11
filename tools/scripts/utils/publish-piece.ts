import assert from 'node:assert'
import { argv } from 'node:process'
import { exec } from './exec'
import { folderExists, readPackageJson, readProjectJson } from './files'

export const publishPiece = async (name: string): Promise<void> => {
  assert(name, '[publishPiece] parameter "name" is required')

  const types = ['community', 'custom']
  let found = false;
  for (const type of types) {
    const path = `packages/pieces/${type}/${name}`;
    const exists = await folderExists(path)
    if (!exists) {
      continue
    }
    found = true;
    const { version } = await readPackageJson(path)
    const { name: nxProjectName } = await readProjectJson(path)

    await exec(`npx nx build ${nxProjectName}`)

    const nxPublishProjectCommand = `
      node tools/scripts/publish.mjs \
        ${nxProjectName} \
        ${version} \
        latest
    `


    await exec(nxPublishProjectCommand)

    console.info(`[publishPiece] success, name=${name}, version=${version}`)
  }

  if (!found) {
    throw new Error(`[publishPiece] piece not found, name=${name}`)
  }

}

const main = async (): Promise<void> => {
  const pieceName = argv[2]
  await publishPiece(pieceName)
}

/*
 * module is entrypoint, not imported i.e. invoked directly
 * see https://nodejs.org/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main()
}
