import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { History } from '../../models'
import { CreateHistoryInput } from '../../graphql.schema'

@Resolver('History')
export class HistoryResolver {
	constructor(
		@InjectRepository(History)
		private readonly historyRepository: MongoRepository<History>
	) {}

	@Query(() => [History])
	async histories(
		@Args('start') start: number,
		@Args('end') end: number
	): Promise<History[]> {
		// console.log(start, end)
		const isoStart = new Date(start)
		const isoEnd = new Date(end)

		return this.historyRepository.find({
			where: { createdAt: { $gte: isoStart, $lte: isoEnd } },
			order: { createdAt: 'DESC' },
			cache: true
		})
	}

	@Mutation(() => History)
	async createHistory(
		@Args('input') input: CreateHistoryInput
	): Promise<History> {
		const { userId, description } = input

		const history = new History()
		history.userId = userId
		history.description = description

		return this.historyRepository.save(history)
	}
}
