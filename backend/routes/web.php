<?php

// The storefront is the separate Next.js app (frontend/) — this backend only
// serves /api and Filament's /admin, so there's no public web route here.
// (A closure route here would also break `route:cache` at deploy time.)
