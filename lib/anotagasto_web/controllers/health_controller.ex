defmodule AnotagastoWeb.HealthController do
  use AnotagastoWeb, :controller

  def index(conn, _params) do
    json(conn, %{status: "ok"})
  end
end
