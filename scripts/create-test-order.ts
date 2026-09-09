import prisma from "../src/lib/prisma";

async function makeTestOrder() {
  const p = await prisma.product.findFirst();
  if (!p) return;
  const o = await prisma.order.create({
    data: {
      orderNumber: "CHP-1001",
      customerName: "Kaya Pilotu Emre",
      customerEmail: "emre@rcpilot.com",
      customerPhone: "05551234567",
      shippingAddress: "Tırmanış Parkuru No:14",
      city: "Bursa",
      paymentMethod: "BANK_TRANSFER",
      paymentStatus: "PENDING",
      status: "PROCESSING",
      subtotal: p.basePrice,
      total: p.basePrice,
      trackingNumber: "YRT-88492019",
      trackingUrl: "https://yurticikargo.com/takip",
      items: {
        create: [
          {
            productId: p.id,
            productTitle: p.title,
            price: p.basePrice,
            quantity: 1,
            total: p.basePrice,
          },
        ],
      },
    },
  });
  console.log("Created order:", o.orderNumber);
}

makeTestOrder()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
