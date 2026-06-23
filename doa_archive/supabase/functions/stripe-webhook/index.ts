import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const stripe = new Stripe(stripeKey)
  const signature = req.headers.get('stripe-signature') ?? ''
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    return new Response(
      `Webhook signature verification failed: ${err instanceof Error ? err.message : String(err)}`,
      { status: 400 },
    )
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'payment_intent.payment_failed'
  ) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const userId = paymentIntent.metadata?.user_id
    const status = event.type === 'payment_intent.succeeded' ? 'succeeded' : 'failed'

    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single()

    if (!existing) {
      await supabase.from('payments').insert({
        user_id: userId,
        amount: paymentIntent.amount,
        stripe_payment_intent_id: paymentIntent.id,
        status,
      })

      if (status === 'succeeded' && userId) {
        await supabase.from('profiles').update({ is_member: true }).eq('id', userId)
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
