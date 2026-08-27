import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseUseCaseRequest): Promise<GetUserMetricsUseUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
