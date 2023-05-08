import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    let index = 0

    while (index < 20) {
      const newAnswerComment = makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      })

      await inMemoryAnswerCommentsRepository.create(newAnswerComment)

      index++
    }

    const { answerComments } = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(answerComments).toHaveLength(20)
  })

  it('should be able to fetch paginated answer comments', async () => {
    let index = 0

    while (index < 22) {
      const newAnswerComment = makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      })

      await inMemoryAnswerCommentsRepository.create(newAnswerComment)

      index++
    }

    const { answerComments } = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(answerComments).toHaveLength(2)
  })
})
