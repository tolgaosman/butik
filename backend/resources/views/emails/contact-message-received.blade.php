@component('mail::message')
# Yeni İletişim Mesajı

**Ad Soyad:** {{ $contactMessage->name }}
**E-posta:** {{ $contactMessage->email }}
@if($contactMessage->phone)
**Telefon:** {{ $contactMessage->phone }}
@endif
@if($contactMessage->subject)
**Konu:** {{ $contactMessage->subject }}
@endif

{{ $contactMessage->message }}

Sevgi Butik Admin Panel
@endcomponent
