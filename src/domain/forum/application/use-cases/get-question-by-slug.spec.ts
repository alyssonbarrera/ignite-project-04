import { makeQuestion } from 'test/factories/make-question'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('question-title'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'question-title',
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to get a question by slug if it does not exist', async () => {
    const result = await sut.execute({
      slug: 'question-title',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
