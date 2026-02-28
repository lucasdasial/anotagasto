defmodule Anotagasto.ExpensesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Anotagasto.Expenses` context.
  """

  @doc """
  Generate a expense.
  """
  def expense_fixture(attrs \\ %{}) do
    {:ok, expense} =
      attrs
      |> Enum.into(%{
        category: :food,
        description: "some description",
        user_id: "7488a646-e31f-11e4-aace-600308960662",
        value: 42
      })
      |> Anotagasto.Expenses.create_expense()

    expense
  end
end
