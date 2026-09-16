@php
$paymentLabels = ['cash_on_delivery' => 'Kapıda Ödeme'];
$paymentStatusLabels = ['unpaid' => 'Ödenmedi', 'paid' => 'Ödendi', 'refunded' => 'İade Edildi'];
@endphp
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
<tr>
<td class="stack-col" width="50%" valign="top" style="padding:0 8px 12px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4f7; border-radius:14px;">
<tr>
<td style="padding:18px 20px;">
<p style="margin:0 0 10px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#7a6b68;">Teslimat Adresi</p>
<p style="margin:0; font-size:13px; line-height:1.6; color:#2b2422;">
{{ $order->shipping_name }}<br>
{{ $order->shipping_line1 }}@if($order->shipping_line2), {{ $order->shipping_line2 }}@endif<br>
{{ $order->shipping_district }} / {{ $order->shipping_city }}@if($order->shipping_postal) {{ $order->shipping_postal }}@endif<br>
{{ $order->shipping_phone }}
</p>
</td>
</tr>
</table>
</td>
<td class="stack-col" width="50%" valign="top" style="padding:0 0 12px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4f7; border-radius:14px;">
<tr>
<td style="padding:18px 20px;">
<p style="margin:0 0 10px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#7a6b68;">Sipariş Bilgisi</p>
<p style="margin:0; font-size:13px; line-height:1.6; color:#2b2422;">
Sipariş No: {{ $order->order_number }}<br>
Tarih: {{ $order->created_at->translatedFormat('d M Y') }}<br>
Ödeme: {{ $paymentLabels[$order->payment_method] ?? $order->payment_method }}<br>
Durum: {{ $paymentStatusLabels[$order->payment_status] ?? $order->payment_status }}
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
@if($order->customer_note)
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4f7; border-radius:14px; margin-bottom:28px;">
<tr>
<td style="padding:18px 20px;">
<p style="margin:0 0 6px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#7a6b68;">Sipariş Notunuz</p>
<p style="margin:0; font-size:13px; line-height:1.6; color:#2b2422;">{{ $order->customer_note }}</p>
</td>
</tr>
</table>
@else
<div style="margin-bottom:16px;"></div>
@endif
