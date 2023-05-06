import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    let index = 0

    while (index < 20) {
      const newQuestion = makeQuestion({
        createdAt: new Date(2023, 3, index + 1),
      })

      await inMemoryQuestionsRepository.create(newQuestion)

      index++
    }

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toHaveLength(20)
    expect(questions[0]).toEqual(
      expect.objectContaining({
        createdAt: new Date(2023, 3, 20),
      }),
    )
  })

  it('should be able to fetch paginated recent questions', async () => {
    let index = 0

    while (index < 22) {
      const newQuestion = makeQuestion()

      await inMemoryQuestionsRepository.create(newQuestion)

      index++
    }

    const { questions } = await sut.execute({
      page: 2,
    })

    expect(questions).toHaveLength(2)
  })
})
