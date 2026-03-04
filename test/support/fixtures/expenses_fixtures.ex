defmodule Anotagasto.ExpensesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Anotagasto.Expenses` context.
  """

  @doc """
  Generate a expense.
  """
  def expense_fixture(attrs \\ %{}) do
    user_id = Map.get_lazy(attrs, :user_id, fn ->
      Anotagasto.AccountsFixtures.user_fixture().id
    end)

    {:ok, expense} =
      attrs
      |> Enum.into(%{
        category: :grocery,
        description: "some description",
        user_id: user_id,
        value: 42
      })
      |> Anotagasto.Expenses.create_expense()

    expense
  end
end
