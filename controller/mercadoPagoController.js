const Order = require("../models/order");
const OrderHasProducts = require("../models/order_has_products");

const mercadopago = require("mercadopago");

class Config {
  constructor(accessToken, options = {}) {
    this.accessToken = accessToken;
    this.options = options;
  }
}
const cg = new Config(
  "TEST-5413688469665858-021919-863e12a5933ed9af82cb3bacd6831175-1691522656"
);
const mp1 = new mercadopago.MercadoPagoConfig(cg);

const payments = new mercadopago.Payment(mp1);

module.exports = {
  async createPayment(req, res) {
    let payment = req.body;

    console.log("PAYMENT: ", payment);

    const payment_data = {
      body: {
        token: payment.token,
          issuer_id: payment.issuer_id,
          payment_method_id: payment.payment_method_id,
          transaction_amount: payment.transaction_amount,
          installments: payment.installments,
          payer: {
            email: payment.payer.email,
            identification: {
              type: payment.payer.identification.type,
              number: payment.payer.identification.number
            },
        },
      },
    };

    await payments
      .create(payment_data)
      .then((response) => {
        let data = {body: response}
        console.log("dataaqui: ", data);
        if (data.body !== null && data.body !== undefined) {
          const order = payment.order;
            console.log("order123: ", order);
          Order.create(order, async (err, id) => {
            if (err) {
              return res.status(501).json({
                success: false,
                message: "Hubo un error al momento de crear el pago",
                error: err,
              });
            }

            for (const product of order.products) {
              await OrderHasProducts.create(
                id,
                product.id,
                product.quantity,
                (err, id_data) => {
                  if (err) {
                    return res.status(501).json({
                      success: false,
                      message:
                        "Hubo un error con la creacion de los productos en la orden",
                      error: err,
                    });
                  }
                }
              );
            }
            console.log("dta response: ", data.body);
            return res.status(201).json({
              success: true,
              message: "La orden se ha creado correctamente",
              data: data.body,
            });
          });
        }
      })
      .catch((err) => {
        console.log("Error de mercado pago", err);
        return res.status(501).json({
          success: false,
          message: "Error al crear el pago",
          error: err,
        });
      });
  },
};