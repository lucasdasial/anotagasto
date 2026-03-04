defmodule Anotagasto.Pagination do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false

  @default_page_size 20
  @max_page_size 100

  embedded_schema do
    field :page, :integer, default: 1
    field :page_size, :integer, default: @default_page_size
  end

  def build(params \\ %{}) do
    %__MODULE__{}
    |> cast(params, [:page, :page_size])
    |> validate_number(:page, greater_than_or_equal_to: 1)
    |> validate_number(:page_size,
      greater_than_or_equal_to: 1,
      less_than_or_equal_to: @max_page_size
    )
    |> apply_action(:validate)
  end
end
