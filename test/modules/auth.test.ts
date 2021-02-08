import authResolver from "../../src/graphql/modules/auth/auth.resolver";
import { getSampleContext } from "../utils/context";
import { firebaseHelper } from "../../src/helpers/firebase.helper";
import { expect } from "chai";

jest.mock("../../src/helpers/firebase.helper", () => {
  return {
    FirebaseHelper: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken: (token: string) => {
          return token;
        },
      };
    }),
    firebaseHelper: {
      verifyIdToken: (token: string) => {
        return {
          token,
        };
      },
    },
  };
});

let context = getSampleContext();
describe("# Test login", () => {
  it("should return a token", async (done) => {
    const result = await authResolver.Mutation.login(
      {},
      {
        idToken: "TestToken",
      },
      context
    );

    expect(result.token).to.be.a("string");
    expect(result.user).to.be.an("object");
    done();
  });
});
