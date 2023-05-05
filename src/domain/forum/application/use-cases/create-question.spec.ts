import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Question title',
      content: 'Question content',
    })

    expect(question.id).toBeTruthy()
    expect(question.id).toBeInstanceOf(UniqueEntityID)
    expect(question.content).toEqual('Question content')
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id)
  })
})
