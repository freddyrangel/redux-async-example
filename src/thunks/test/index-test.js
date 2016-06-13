import { expect, assert } from 'chai';
import thunk              from '../lib';

describe('thunk middleware', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const nextHandler = thunk()({dispatch: doDispatch, getState: doGetState});

  it('must return a function to handle next', () => {
    assert.isFunction(nextHandler);
    assert.strictEqual(nextHandler.length, 1);
  });

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler();

      assert.isFunction(actionHandler);
      assert.strictEqual(actionHandler.length, 1);
    });

    describe('handle action', () => {

      it('must run the given action function with dispatch and getState', done => {
        const actionHandler = nextHandler();

        actionHandler((dispatch, getState) => {
          assert.strictEqual(dispatch, doDispatch);
          assert.strictEqual(getState, doGetState);
          done();
        });
      });

      it('must pass action to next if not a function', done => {
        const actionObj = {};

        const actionHandler = nextHandler(action => {
          assert.strictEqual(action, actionObj);
          done();
        });

        actionHandler(actionObj);
      });

      it('must return the return value of next if not a function', () => {
        const expected = 'redux';
        const actionHandler = nextHandler(() => expected);

        const outcome = actionHandler();
        assert.strictEqual(outcome, expected);
      });

      it('must return value as expected if a function', () => {
        const expected = 'rocks';
        const actionHandler = nextHandler();

        const outcome = actionHandler(() => expected);
        assert.strictEqual(outcome, expected);
      });

      it('must be invoked synchronously if a function', () => {
        const actionHandler = nextHandler();
        let mutated = 0;

        actionHandler(() => mutated++);
        assert.strictEqual(mutated, 1);
      });
    });
  });

  describe('handle errors', () => {
    it('must throw if store argument is non-object', done => {
      try {
        thunk()();
      } catch (err) {
        done();
      }
    });
  });

  describe('withExtraArgument', () => {
    it('can be imported as a single member of the module', done => {
      const extraArg = { lol: true };
      thunk(extraArg)({
        dispatch: doDispatch,
        getState: doGetState,
      })()((dispatch, getState, arg) => {
          assert.strictEqual(dispatch, doDispatch);
          assert.strictEqual(getState, doGetState);
          assert.strictEqual(arg, extraArg);
          done();
        });
    });
  });
});
