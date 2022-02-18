import { PacksService } from '@algomart/shared/services'
import { DependencyResolver } from '@algomart/shared/utils'
import { Knex } from 'knex'
import { Model } from 'objection'

import { logger } from '../configuration/logger'

export default async function generatePacksTask(
  registry: DependencyResolver,
  knexRead?: Knex
) {
  const log = logger.child({ task: 'generate-packs' })
  const packs = registry.get<PacksService>(PacksService.name)
  const trx = await Model.startTransaction()
  try {
    const result = await packs.generatePacks(trx, knexRead)
    log.info('generated %d packs', result)
    await trx.commit()
  } catch (error) {
    await trx.rollback()
    log.error(error as Error, 'failed to generate packs')
  }
}
