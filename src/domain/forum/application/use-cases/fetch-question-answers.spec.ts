import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

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

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answers).toHaveLength(20)
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

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answers).toHaveLength(2)
  })
})
