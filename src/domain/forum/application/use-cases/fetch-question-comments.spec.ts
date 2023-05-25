import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    let index = 0

    while (index < 20) {
      const newQuestionComment = makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      })

      await inMemoryQuestionCommentsRepository.create(newQuestionComment)

      index++
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.questionComments).toHaveLength(20)
  })

  it('should be able to fetch paginated question comments', async () => {
    let index = 0

    while (index < 22) {
      const newQuestionComment = makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      })

      await inMemoryQuestionCommentsRepository.create(newQuestionComment)

      index++
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
