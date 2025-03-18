import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0]).toEqual(
        result.value.question,
      )
    }
  })

  it('should not be able to choose the best answer to the question if the author is different from the author of the question', async () => {
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

it('should not be able to choose question best answer if question does not exist', async () => {
  const newQuestion = makeQuestion({
    authorId: new UniqueEntityID('author-1'),
  })

  await inMemoryQuestionsRepository.create(newQuestion)

  const newAnswer = makeAnswer({
    questionId: newQuestion.id,
  })

  await inMemoryAnswersRepository.create(newAnswer)

  await sut.execute({
    authorId: newQuestion.authorId.toString(),
    answerId: newAnswer.id.toString(),
  })
  const result = await sut.execute({
    answerId: 'answer-1',
    authorId: 'author-2',
  })

  expect(result.isLeft()).toBeTruthy()
  expect(result.value).toBeInstanceOf(ResourceNotFoundError)
})
