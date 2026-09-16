{{--
    Table-based progress rail — no flex/grid, so it degrades gracefully in
    Outlook instead of collapsing. $current is 1-4 (Alındı/Onaylandı/
    Kargoda/Teslim Edildi); every step up to it renders filled/checked.
--}}
@php
$steps = ['Alındı', 'Onaylandı', 'Kargoda', 'Teslim Edildi'];
$pink = '#f53380';
$pale = '#ecdfe4';
@endphp
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed; margin:0 0 32px;">
<tr>
@foreach ($steps as $i => $label)
@php($done = ($i + 1) <= $current)
<td width="25%" align="center" style="padding:0;">
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr>
<td width="22" height="22" align="center" valign="middle" bgcolor="{{ $done ? $pink : $pale }}" style="border-radius:11px; font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:700; color:{{ $done ? '#ffffff' : '#a89792' }}; line-height:22px;">
{!! $done ? '&#10003;' : $i + 1 !!}
</td>
</tr>
</table>
<p style="margin:8px 0 0; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; color:{{ $done ? '#2b2422' : '#a89792' }};">{{ $label }}</p>
</td>
@endforeach
</tr>
</table>
