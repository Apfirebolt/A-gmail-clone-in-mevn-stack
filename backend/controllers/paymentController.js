import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Map plan names to Stripe Price IDs (these IDs must be created in your Stripe Dashboard)
const planPriceIds = {
  Pro: process.env.STRIPE_PRO_PRICE_ID,
  Enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

/**
 * @desc    Create a new Stripe Checkout session for subscription
 * @route   POST /api/payments/create-checkout-session
 * @access  Private
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { planName, successUrl, cancelUrl } = req.body;

  const priceId = planPriceIds[planName];

  if (!priceId) {
    res.status(400);
    throw new Error(`Invalid plan name: ${planName}`);
  }

  // Prepare metadata to track the subscription
  const metadata = {
    userId: req.user._id.toString(), // MongoDB ID of the user
    planName: planName,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    client_reference_id: req.user._id.toString(),
    metadata: metadata,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  // Send the Stripe redirect URL back to the Vue frontend
  res.json({ url: session.url });
});

/**
 * @desc    Handle incoming Stripe webhook events (e.g., payment success)
 * @route   POST /api/payments/webhook
 * @access  Public (Signature validated internally)
 */
const webhookHandler = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    // If signature is invalid, Stripe throws an error and we respond with 400
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userId = session.client_reference_id;
      const planName = session.metadata.planName;
      const subscriptionId = session.subscription; // Store this for cancellation later

      if (userId && planName) {
        // Update user in MongoDB
        await User.findByIdAndUpdate(
          userId,
          {
            subscription: {
              plan: planName,
              status: "active",
              stripeSubscriptionId: subscriptionId,
              startDate: new Date(),
            },
          },
          { new: true }
        );

        console.log(
          `✅ Subscription activated for User ID: ${userId}, Plan: ${planName}`
        );
      }
      break;

    case "invoice.payment_failed":
      const invoice = event.data.object;
      // Handle failed recurring payment (e.g., mark subscription as past_due or canceled)
      console.log(
        `❌ Payment failed for Subscription ID: ${invoice.subscription}`
      );
      break;

    case "customer.subscription.deleted":
      const subscription = event.data.object;
      const canceledUserId = subscription.client_reference_id;
      // Handle subscription cancellation (e.g., update user plan to 'Free' or 'Canceled')
      console.log(`❌ Subscription cancelled for User ID: ${canceledUserId}`);
      break;

    default:
      // Log unhandled events for debugging
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

export { createCheckoutSession, webhookHandler };
