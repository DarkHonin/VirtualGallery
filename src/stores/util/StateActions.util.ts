import type { Store } from 'pinia'
import { reactive } from 'vue'

export type StateActions<t extends Object> = { [actionName in keyof t]: boolean }

export interface StoreState<t extends Object> {
  _stateActions: StateActions<t>
}

export const defineStateActions = <t extends { [key: string]: string }>(actionKeys: t) => {
  const stateActions = <StateActions<t>>(
    Object.fromEntries(Object.entries(actionKeys).map(([key, v]) => [key, false]))
  )

  return {
    state: {
      _stateActions: stateActions
    },
    getters: {
      actions: () => actionKeys,
      activeActions: ({ _stateActions }: StoreState<t>) =>
        Object.entries(_stateActions)
          .filter(([k, v]) => v)
          .map(([k, v]) => actionKeys[k]),
      isActionActive:
        ({ _stateActions }: StoreState<t>) =>
        (actionKey: keyof t) =>
          _stateActions[actionKey],
      isActing: ({ _stateActions }: StoreState<t>) => Object.values(_stateActions).some((e) => e)
    },
    async runAction(
      { _stateActions }: StoreState<t>,
      action: keyof t,
      cb: { (): void | Promise<any> }
    ) {
      _stateActions[action] = true
      try {
        return await cb()
      } catch (err) {
        console.error(err)
        throw err
      } finally {
        _stateActions[action] = false
      }
    }
  }
}
