defmodule Anotagasto.Repo do
  use Ecto.Repo,
    otp_app: :anotagasto,
    adapter: Ecto.Adapters.Postgres
end
