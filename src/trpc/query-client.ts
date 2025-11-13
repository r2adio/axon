import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
// import superjson from "superjson";

export function makeQueryClient() {
  // tanstack-react-query configuration
  // aka singleton tanstack query instance:
  // -> single globally shared query client
  return new QueryClient({
    // QueryClient: managing cache, making netwrok requests, etc.
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
