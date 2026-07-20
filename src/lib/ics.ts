/**
 * .ics 是全店唯一真的送达物：日历邀请。字段全按 RFC 5545，能进真日历。
 * 预约确认页（Concierge）与 Me 的预约列表共用这一份。
 */
export function downloadAppointmentIcs(productName: string | undefined, boutique: string, at: Date) {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const end = new Date(at.getTime() + 45 * 60000)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maison Zero//LuxuryNeverComes//EN',
    'BEGIN:VEVENT',
    `UID:${at.getTime()}@luxurynevercomes`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(at)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(`Private appointment, ${boutique}`)}`,
    `DESCRIPTION:${esc(
      `${productName ? `Regarding ${productName}. ` : ''}The salon will be expecting you. The salon does not exist, but the hour is yours.`,
    )}`,
    `LOCATION:${esc(boutique)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'maison-zero-appointment.ics'
  a.click()
  URL.revokeObjectURL(url)
}
