import {
  CreateUserAccountRequest,
  ExternalId,
  Passphrase,
  Username,
  UsersQuerystring,
} from '@algomart/schemas'
import { UpdateUserAccount } from '@algomart/schemas'
import { AccountsService } from '@algomart/shared/services'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createAccount(
  request: FastifyRequest<{ Body: CreateUserAccountRequest }>,
  reply: FastifyReply
) {
  const accounts = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  const account = await accounts.create(request.body, request.transaction)
  if (account) {
    reply.status(201).send(account)
  } else {
    reply.badRequest('username and/or externalId already in use')
  }
}

export async function updateAccount(
  request: FastifyRequest<{ Body: UpdateUserAccount; Params: ExternalId }>,
  reply: FastifyReply
) {
  const accounts = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  await accounts.updateAccount(
    {
      ...request.body,
      ...request.params,
    },
    request.transaction
  )
  reply.status(204).send()
}

export async function getByExternalId(
  request: FastifyRequest<{ Params: ExternalId }>,
  reply: FastifyReply
) {
  const accounts = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  const account = await accounts.getByExternalId(request.params)
  reply.send(account)
}

export async function getByUsername(
  request: FastifyRequest<{ Querystring: Username }>,
  reply: FastifyReply
) {
  const accounts = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  const account = await accounts.getByUsername(request.query)
  reply.send(account)
}

export async function getUsers(
  request: FastifyRequest<{ Querystring: UsersQuerystring }>,
  reply: FastifyReply
) {
  const accountService = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  const users = await accountService.getUsers(request.query)
  reply.send(users)
}

export async function verifyPassphrase(
  request: FastifyRequest<{ Params: ExternalId; Body: Passphrase }>,
  reply: FastifyReply
) {
  const accounts = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  const isValid = await accounts.verifyPassphraseFor(
    request.params.externalId,
    request.body.passphrase
  )
  reply.status(200).send({ isValid })
}

export async function verifyUsername(
  request: FastifyRequest<{ Body: Username }>,
  reply: FastifyReply
) {
  const accounts = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  const userExists = await accounts.verifyUsername(request.body.username)
  reply.status(200).send({ isAvailable: !userExists })
}

export async function removeUser(
  request: FastifyRequest<{ Params: ExternalId }>,
  reply: FastifyReply
) {
  const accounts = request
    .getContainer()
    .get<AccountsService>(AccountsService.name)
  await accounts.removeUser(request.params)
  reply.status(204).send()
}
