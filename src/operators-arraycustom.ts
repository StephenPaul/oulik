import { ArrayOfElementsCommonAction, ArrayOfObjectsCommonAction, FindOrFilter, Trackability, UpdateOptions } from './shapes-external';
import { ArrayCustomState } from './shapes-internal';
import { errorMessages } from './shared-consts';
import { copyPayload, deepFreeze, processAsyncPayload, toIsoString } from './shared-utils';

export const replace = <S, C, X extends C & Array<any>, F extends FindOrFilter, T extends Trackability>(
  context: ArrayCustomState<S, C, X, T>,
) => ((payload, updateOptions) => {
  const { type, updateState, selector, predicate } = context;
  const processPayload = (payload: C) => {
    const { payloadFrozen, payloadCopied } = copyPayload(payload);
    const elementIndices = getElementIndices(context);
    updateState({
      selector,
      replacer: old => old.map((o, i) => elementIndices.includes(i) ? payloadFrozen : o),
      mutator: old => { old.forEach((o, i) => { if (elementIndices.includes(i)) { old[i] = payloadCopied; } }) },
      actionName: `${type}().replace()`,
      payload: {
        query: predicate.toString(),
        replacement: payloadFrozen,
      },
      updateOptions: updateOptions as UpdateOptions<T, C, any>,
    });
  }
  return processAsyncPayload(selector, payload, context.pathReader, context.storeResult, processPayload, updateOptions as UpdateOptions<T, C, any>, type + '()');
}) as ArrayOfElementsCommonAction<X, F, T>['replace'];

export const patch = <S, C, X extends C & Array<any>, F extends FindOrFilter, T extends Trackability>(
  context: ArrayCustomState<S, C, X, T>,
) => ((payload, updateOptions) => {
  const { type, updateState, selector, predicate } = context;
  const processPayload = (payload: C) => {
    const { payloadFrozen, payloadCopied } = copyPayload(payload);
    const elementIndices = getElementIndices(context);
    updateState({
      selector,
      replacer: old => old.map((o, i) => elementIndices.includes(i) ? { ...o, ...payloadFrozen } : o),
      mutator: old => elementIndices.forEach(i => Object.assign(old[i], payloadCopied)),
      actionName: `${type}().patch()`,
      payload: { patch: payloadFrozen, query: predicate.toString() },
      updateOptions: updateOptions as UpdateOptions<T, C, any>,
    });
  }
  return processAsyncPayload(selector, payload, context.pathReader, context.storeResult, processPayload, updateOptions as UpdateOptions<T, C, any>, type + '()');
}) as ArrayOfObjectsCommonAction<X, F, T>['patch'];

export const remove = <S, C, X extends C & Array<any>, F extends FindOrFilter, T extends Trackability>(
  context: ArrayCustomState<S, C, X, T>,
) => (updateOptions => {
  const { type, updateState, selector, predicate, getCurrentState } = context;
  const elementIndices = getElementIndices(context);
  updateState({
    selector,
    replacer: old => old.filter((o, i) => !elementIndices.includes(i)),
    mutator: old => {
      if (type === 'find') {
        old.splice(elementIndices[0], 1);
      } else {
        const toRemove = old.filter(predicate);
        for (var i = 0; i < old.length; i++) {
          if (toRemove.includes(old[i])) {
            old.splice(i, 1); i--;
          }
        }
      }
    },
    actionName: `${type}().remove()`,
    payload: { toRemove: (selector(getCurrentState()) as X)[type]((e, i) => elementIndices.includes(i)), query: predicate.toString() },
    updateOptions,
  });
}) as ArrayOfElementsCommonAction<X, F, T>['remove'];

export const onChange = <S, C, X extends C & Array<any>, F extends FindOrFilter, T extends Trackability>(
  context: ArrayCustomState<S, C, X, T>,
) => (performAction => {
  const { type, selector, predicate, changeListeners } = context;
  changeListeners.set(performAction, nextState => deepFreeze(type === 'find'
    ? (selector(nextState) as X).find(e => predicate(e))
    : { $filtered: (selector(nextState) as X).filter(e => predicate(e)) }));
  return { unsubscribe: () => changeListeners.delete(performAction) };
}) as ArrayOfElementsCommonAction<X, F, T>['onChange'];

export const read = <S, C, X extends C & Array<any>, F extends FindOrFilter, T extends Trackability>(
  context: ArrayCustomState<S, C, X, T>,
) => (() => {
  const { type, selector, predicate, getCurrentState } = context;
  return deepFreeze(type === 'find'
    ? (selector(getCurrentState()) as X).find(e => predicate(e))
    : (selector(getCurrentState()) as X).map(e => predicate(e) ? e : null).filter(e => e != null))
}) as ArrayOfElementsCommonAction<X, F, T>['read'];

export const invalidateCache = <S, C, X extends C & Array<any>, T extends Trackability>(
  context: ArrayCustomState<S, C, X, T>,
) => {
  const { pathReader, storeResult, selector, type } = context;
  pathReader.readSelector(selector);
  const pathSegs = pathReader.pathSegments.join('.') + (pathReader.pathSegments.length ? '.' : '') + type + '()';
  const patch = {} as { [key: string]: string };
  Object.keys(storeResult().read().cacheExpiryTimes)
    .filter(key => key.startsWith(pathSegs))
    .forEach(key => patch[key] = toIsoString(new Date()));
  storeResult(s => (s as any).cacheExpiryTimes).patch(patch);
}

const getElementIndices = <S, C, X extends C & Array<any>, T extends Trackability>(
  context: ArrayCustomState<S, C, X, T>,
) => {
  const { type, selector, predicate, getCurrentState } = context;
  const elementIndices = type === 'find'
    ? [(selector(getCurrentState()) as X).findIndex(e => predicate(e))]
    : (selector(getCurrentState()) as X).map((e, i) => predicate(e) ? i : null).filter(i => i !== null) as number[];
  if (type === 'find' && elementIndices[0] === -1) { throw new Error(errorMessages.NO_ARRAY_ELEMENT_FOUND); }
  return elementIndices;
}