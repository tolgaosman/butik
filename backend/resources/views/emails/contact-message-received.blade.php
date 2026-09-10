@extends('emails.layout')

@section('title', 'Yeni İletişim Mesajı')

@section('content')
<p style="margin:0 0 6px; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#c7175a;">İletişim Formu</p>
<h1 style="margin:0 0 20px; font-size:22px; font-weight:600; color:#2b2422;">Yeni bir mesaj var</h1>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:24px;">
<tr>
<td style="padding:10px 0; font-size:13px; color:#7a6b68; width:110px;">Ad Soyad</td>
<td style="padding:10px 0; font-size:14px; color:#2b2422; border-bottom:1px solid #f7dfe8;">{{ $contactMessage->name }}</td>
</tr>
<tr>
<td style="padding:10px 0; font-size:13px; color:#7a6b68;">E-posta</td>
<td style="padding:10px 0; font-size:14px; color:#2b2422; border-bottom:1px solid #f7dfe8;"><a href="mailto:{{ $contactMessage->email }}" style="color:#c7175a; text-decoration:none;">{{ $contactMessage->email }}</a></td>
</tr>
@if($contactMessage->phone)
<tr>
<td style="padding:10px 0; font-size:13px; color:#7a6b68;">Telefon</td>
<td style="padding:10px 0; font-size:14px; color:#2b2422; border-bottom:1px solid #f7dfe8;">{{ $contactMessage->phone }}</td>
</tr>
@endif
@if($contactMessage->subject)
<tr>
<td style="padding:10px 0; font-size:13px; color:#7a6b68;">Konu</td>
<td style="padding:10px 0; font-size:14px; color:#2b2422; border-bottom:1px solid #f7dfe8;">{{ $contactMessage->subject }}</td>
</tr>
@endif
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4f7; border-radius:14px;">
<tr>
<td style="padding:20px 24px; font-size:14px; line-height:1.6; color:#2b2422;">
{{ $contactMessage->message }}
</td>
</tr>
</table>
@endsection
