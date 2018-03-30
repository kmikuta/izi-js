import { BeansContext } from './BeansContext'
import { Config } from './Config'

export type BeanIdentity = string | Function

export interface Bean {

  iziInitCalled: boolean

  iziInjectingInProgress: boolean

  iziContextCalled: boolean

  iziContext? (context: BeansContext): void

  iziInit? (): void

  iziDestroy? (): void

  [key: string]: any
}

export type BeansConfig = {
  [key: string]: any
}

export interface BeanCreationStrategy {

  init (beansContext: BeansContext): Bean

  create (beansContext: BeansContext): Bean

  matchesByType (type: Function): boolean

  getArguments (): string[]
}

export interface StrategyClass {
  new (config: Config): BeanCreationStrategy
}

export type AnyProps = { [key: string]: any }

export type AnyArgs = any[]

export interface ClassConstructor {
  new (...args: AnyArgs): any
}

export interface DecoratorInjectionConfig {

  property?: string

  through? (dependency: any): any

  by? (target: Element, prop: string, dependency: any): void
}
