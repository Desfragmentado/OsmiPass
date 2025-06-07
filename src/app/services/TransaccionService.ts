import db from '@adonisjs/lucid/services/db'

interface TransaccionPayload {
  folio: string
  customer_email: string
  customer_name: string
  monto: number
  status: string
  stripe_session_id: string
}

export async function crearTransaccion(payload: TransaccionPayload) {
  // Buscar el boleto por folio
  const boleto = await db.from('boletos').where('folio', payload.folio).first()

  if (!boleto) {
    throw new Error(`No existe boleto con folio ${payload.folio}`)
  }

  // Insertar la transacción con el id del boleto
  await db.table('transacciones').insert({
    id: boleto.id,
    customer_email: payload.customer_email,
    customer_name: payload.customer_name,
    folio: payload.folio,
    monto: payload.monto,
    status: payload.status,
    stripe_session_id: payload.stripe_session_id,
    created_at: new Date(),
    updated_at: new Date()
  })

  console.log('✅ Transacción creada exitosamente')
}
