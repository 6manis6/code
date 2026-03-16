import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(amount: number) {
  return `NPR ${amount.toLocaleString("en-IN")}`;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const customerName = body.customerName?.trim();
    const customerPhone = body.customerPhone?.trim();
    const customerEmail = body.customerEmail?.trim();
    const district = body.district?.trim();
    const city = body.city?.trim();
    const wardNumber = body.wardNumber?.trim();
    const chowk = body.chowk?.trim();
    const items = Array.isArray(body.items) ? body.items : [];
    const totalAmount = Number(body.totalAmount);

    if (
      !customerName ||
      !customerPhone ||
      !customerEmail ||
      !district ||
      !city ||
      !wardNumber ||
      !chowk ||
      items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields" },
        { status: 400 },
      );
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      customerEmail,
      district,
      city,
      wardNumber,
      chowk,
      items,
      totalAmount,
      status: body.status || "pending",
    });

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || smtpUser;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser;

    if (smtpUser && smtpPass && adminEmail && fromEmail) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const orderItemsText = items
        .map(
          (item: any) =>
            `- ${item.productName} x ${item.quantity} = ${formatCurrency(Number(item.price) * Number(item.quantity))}`,
        )
        .join("\n");

      const orderItemsHtml = items
        .map(
          (item: any) =>
            `<li>${escapeHtml(item.productName)} x ${item.quantity} = ${escapeHtml(formatCurrency(Number(item.price) * Number(item.quantity)))}</li>`,
        )
        .join("");

      await Promise.all([
        transporter.sendMail({
          from: `Kurama Orders <${fromEmail}>`,
          to: customerEmail,
          subject: "Order Confirmation - Kurama Collections",
          text: `Hi ${customerName},\n\nThank you for your order.\n\nOrder ID: ${order._id}\nDelivery Address: ${chowk}, Ward ${wardNumber}, ${city}, ${district}\n\nItems:\n${orderItemsText}\n\nTotal: ${formatCurrency(totalAmount)}\n\nWe will contact you soon.`,
          html: `
            <h2>Thank you for your order!</h2>
            <p>Hi ${escapeHtml(customerName)},</p>
            <p>Your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> ${escapeHtml(String(order._id))}</p>
            <p><strong>Delivery Address:</strong> ${escapeHtml(chowk)}, Ward ${escapeHtml(wardNumber)}, ${escapeHtml(city)}, ${escapeHtml(district)}</p>
            <p><strong>Items:</strong></p>
            <ul>${orderItemsHtml}</ul>
            <p><strong>Total:</strong> ${escapeHtml(formatCurrency(totalAmount))}</p>
            <p>We will contact you soon.</p>
          `,
        }),
        transporter.sendMail({
          from: `Kurama Orders <${fromEmail}>`,
          to: adminEmail,
          replyTo: customerEmail,
          subject: `New Order from ${customerName}`,
          text: `New order received.\n\nOrder ID: ${order._id}\nName: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\nAddress: ${chowk}, Ward ${wardNumber}, ${city}, ${district}\n\nItems:\n${orderItemsText}\n\nTotal: ${formatCurrency(totalAmount)}`,
          html: `
            <h2>New Order Received</h2>
            <p><strong>Order ID:</strong> ${escapeHtml(String(order._id))}</p>
            <p><strong>Name:</strong> ${escapeHtml(customerName)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(customerPhone)}</p>
            <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
            <p><strong>Address:</strong> ${escapeHtml(chowk)}, Ward ${escapeHtml(wardNumber)}, ${escapeHtml(city)}, ${escapeHtml(district)}</p>
            <p><strong>Items:</strong></p>
            <ul>${orderItemsHtml}</ul>
            <p><strong>Total:</strong> ${escapeHtml(formatCurrency(totalAmount))}</p>
          `,
        }),
      ]);
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    );
  }
}
