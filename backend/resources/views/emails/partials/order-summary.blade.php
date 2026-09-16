{{-- Product rows with a thumbnail, then the full price breakdown that was
     previously just a bare "Toplam" — the gap between a line item's price
     and the grand total (shipping, discount) needs to be visible here or
     it reads as an accounting error. --}}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:20px;">
@foreach ($order->items as $item)
<tr>
<td width="64" valign="top" style="padding:14px 14px 14px 0; border-bottom:1px solid #f7dfe8;">
<img src="{{ $item->imageUrl() }}" width="64" height="80" alt="{{ $item->product_name }}" style="display:block; width:64px; height:80px; object-fit:cover; border-radius:10px; background-color:#fdf4f7;">
</td>
<td valign="top" style="padding:14px 0; border-bottom:1px solid #f7dfe8;">
<p style="margin:0; font-size:14px; font-weight:500; color:#2b2422;">{{ $item->product_name }}</p>
@if($item->size)<p style="margin:4px 0 0; font-size:12px; color:#7a6b68;">Beden: {{ $item->size }}</p>@endif
<p style="margin:4px 0 0; font-size:12px; color:#7a6b68;">Adet: {{ $item->quantity }}</p>
</td>
<td align="right" valign="top" style="padding:14px 0; border-bottom:1px solid #f7dfe8; white-space:nowrap;">
<p style="margin:0; font-size:14px; font-weight:500; color:#2b2422;">{{ \App\Support\Money::tl($item->line_total_minor) }}</p>
</td>
</tr>
@endforeach
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
<tr>
<td style="padding:4px 0; font-size:13px; color:#7a6b68;">Ara Toplam</td>
<td align="right" style="padding:4px 0; font-size:13px; color:#2b2422;">{{ \App\Support\Money::tl($order->subtotal_minor) }}</td>
</tr>
<tr>
<td style="padding:4px 0; font-size:13px; color:#7a6b68;">Kargo</td>
<td align="right" style="padding:4px 0; font-size:13px; color:#2b2422;">{{ $order->shipping_minor > 0 ? \App\Support\Money::tl($order->shipping_minor) : 'Ücretsiz' }}</td>
</tr>
@if($order->discount_minor > 0)
<tr>
<td style="padding:4px 0; font-size:13px; color:#7a6b68;">İndirim</td>
<td align="right" style="padding:4px 0; font-size:13px; color:#c7175a;">-{{ \App\Support\Money::tl($order->discount_minor) }}</td>
</tr>
@endif
<tr>
<td style="padding:12px 0 0; font-size:16px; font-weight:600; color:#2b2422; border-top:1px solid #ecdfe4;">Toplam</td>
<td align="right" style="padding:12px 0 0; font-size:16px; font-weight:600; color:#c7175a; border-top:1px solid #ecdfe4;">{{ \App\Support\Money::tl($order->total_minor) }}</td>
</tr>
</table>
