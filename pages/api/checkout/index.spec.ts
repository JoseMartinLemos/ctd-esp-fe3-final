import { createMocks } from "node-mocks-http";
import handleCheckout, {
  invalidAddress,
  validCard,
  withoutAuthorization,
  withoutFunds,
} from "dh-marvel/pages/api/checkout/index.route";
import {
  ERROR_CARD_DATA_INCORRECT,
  ERROR_CARD_WITHOUT_AUTHORIZATION,
  ERROR_CARD_WITHOUT_FUNDS,
  ERROR_INCORRECT_ADDRESS,
  ERROR_METHOD_NOT_ALLOWED,
  ERROR_SERVER,
} from "dh-marvel/services/checkout/checkout.errors";
import { ICheckout } from "types/ICheckout.type";

describe("Checkout", () => {
  describe("when sending a valid POST, customer and card data", () => {
    it("should return status 200", async () => {
      const order = {
        personalData: { direccion: {} },
        paymentData: { number: validCard },
      } as ICheckout;
      const { req, res } = createMocks({
        method: "POST",
        body: order,
      });
      await handleCheckout(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({ data: order })
      );
    });
  });
  describe("when sending a non POST request", () => {
    it("should return a 405 error", async () => {
      const { req, res } = createMocks({
        method: "GET",
      });
      await handleCheckout(req, res);
      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining(ERROR_METHOD_NOT_ALLOWED)
      );
    });
  });
  describe("when sending an invalid address", () => {
    it("should return a 400 error", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          personalData: { direccion: { calle: invalidAddress } },
        } as ICheckout,
      });
      await handleCheckout(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining(ERROR_INCORRECT_ADDRESS)
      );
    });
  });
  describe("when sending an invalid form", () => {
    it("should return a 500 error", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {} as ICheckout,
      });
      await handleCheckout(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining(ERROR_SERVER)
      );
    });
  });
  describe("when sending a card without funds", () => {
    it("should return a 400 error", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          personalData: { direccion: {} },
          paymentData: { number: withoutFunds },
        } as ICheckout,
      });
      await handleCheckout(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining(ERROR_CARD_WITHOUT_FUNDS)
      );
    });
  });
  describe("when sending a card without authorization", () => {
    it("should return a 400 error", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          personalData: { direccion: {} },
          paymentData: { number: withoutAuthorization },
        } as ICheckout,
      });
      await handleCheckout(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining(ERROR_CARD_WITHOUT_AUTHORIZATION)
      );
    });
  });
  describe("when sending a card with invalid data", () => {
    it("should return a 400 error", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          personalData: { direccion: {} },
          paymentData: { number: "4111" },
        } as ICheckout,
      });
      await handleCheckout(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining(ERROR_CARD_DATA_INCORRECT)
      );
    });
  });
});
