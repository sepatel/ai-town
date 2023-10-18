import { agentInputs } from './agents';
import { ObjectType, v } from 'convex/values';
import { movePlayer } from './movement';
import { conversationInputs } from './conversations';
import { point } from '../util/types';
import { AiTown } from './aiTown';
import { inputHandler } from './inputHandler';
import { joinGame, leaveGame } from './players';

// Join, creating a new player...
export const join = inputHandler({
  args: {
    name: v.string(),
    character: v.string(),
    description: v.string(),
    tokenIdentifier: v.optional(v.string()),
  },
  handler: async (game, now, args) => {
    return await joinGame(
      game,
      now,
      args.name,
      args.character,
      args.description,
      args.tokenIdentifier,
    );
  },
});
// ...or leave, disabling the specified player.
const leave = inputHandler({
  args: {
    playerId: v.id('players'),
  },
  handler: async (game: AiTown, now: number, { playerId }) => {
    await leaveGame(game, now, playerId);
    return null;
  },
});
// Move the player to a specified location.
const moveTo = inputHandler({
  args: {
    playerId: v.id('players'),
    destination: v.union(point, v.null()),
  },
  handler: async (game: AiTown, now: number, { playerId, destination }) => {
    movePlayer(game, now, playerId, destination);
    return null;
  },
});
export const inputs = {
  join,
  leave,
  moveTo,
  // Inputs for the messaging layer.
  ...conversationInputs,
  startConversation: conversationInputs.startConversation,

  // Inputs for the agent layer.
  ...agentInputs,
};
export type Inputs = typeof inputs;
export type InputNames = keyof Inputs;
export type InputArgs<Name extends InputNames> = ObjectType<Inputs[Name]['args']>;
export type InputReturnValue<Name extends InputNames> = ReturnType<
  Inputs[Name]['handler']
> extends Promise<infer T>
  ? T
  : never;
