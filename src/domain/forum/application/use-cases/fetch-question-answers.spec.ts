import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    let index = 0

    while (index < 20) {
      const newAnswer = makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })

      await inMemoryAnswersRepository.create(newAnswer)

      index++
    }

    const { answers } = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(answers).toHaveLength(20)
  })

  it('should be able to fetch paginated question answers', async () => {
    let index = 0

    while (index < 22) {
      const newAnswer = makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })

      await inMemoryAnswersRepository.create(newAnswer)

      index++
    }

    const { answers } = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(answers).toHaveLength(2)
  })
})
