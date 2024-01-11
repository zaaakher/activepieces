import { readdir } from 'node:fs/promises'

export const getAvailablePieceNames = async (): Promise<{ type: string, pieceName: string }[]> => {
  const ignoredPackages = ['framework', 'apps', 'dist', 'common']
  const packageNamesCommunity = await readdir('packages/pieces/community')
  const packageNamesCustom = await readdir('packages/pieces/custom')
  const packageNames = [...packageNamesCommunity, ...packageNamesCustom]
  
  return packageNames.filter(p => !ignoredPackages.includes(p)).map((p) => {
    return {
      type: packageNamesCommunity.includes(p) ? 'community' : 'custom',
      pieceName: p,
    }
  })
}
