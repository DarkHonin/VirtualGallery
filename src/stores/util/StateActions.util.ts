import type { Store } from "pinia";
import { reactive } from "vue";

export type StateActions<t extends Object> = {
  [actionName in keyof t]: boolean;
};

export interface StoreState<t extends Object> {
  _stateActions: StateActions<t>;
}

export const defineStateActions = <t extends Object>(actionKeys: t) => {
  const stateActions = <StateActions<t>> (
    Object.fromEntries(
      Object.entries(actionKeys).map(([key, v]) => [key, false]),
    )
  );

  return {
    state: {
      _stateActions: stateActions,
    },
    getters: {
      actions: () => actionKeys,
      activeActions: ({ _stateActions }: StoreState<t>) =>
        Object.entries(_stateActions)
          .filter(([k, v]) => v)
          .map(([k, v]) => actionKeys[k as keyof t]),
      isActionActive:
        ({ _stateActions }: StoreState<t>) =>
        (actionKey: keyof t | (keyof t)[]) =>
          typeof actionKey == "string"
            ? _stateActions[<keyof t> actionKey]
            : [...<(keyof t)[]> actionKey].some((opt) => _stateActions[opt]),
      isActing: ({ _stateActions }: StoreState<t>) =>
        Object.values(_stateActions).some((e) => e),
    },
    async runAction(
      { _stateActions }: StoreState<t>,
      action: keyof t,
      cb: { (): void | Promise<any> },
    ) {
      if (_stateActions[action]) {
        throw `Already preforming action '${<string> action}:${
          _stateActions[action]
        }'`;
      }
      _stateActions[action] = true;
      try {
        return await cb();
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        _stateActions[action] = false;
      }
    },
  };
};
