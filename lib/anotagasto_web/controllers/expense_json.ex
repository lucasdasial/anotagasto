defmodule AnotagastoWeb.ExpenseJSON do
  alias Anotagasto.Expenses.Expense

  @doc """
  Renders a list of expenses.
  """
  def index(%{expenses: expenses}) do
    %{data: for(expense <- expenses, do: data(expense))}
  end

  @doc """
  Renders a single expense.
  """
  def show(%{expense: expense}) do
    %{data: data(expense)}
  end

  defp data(%Expense{} = expense) do
    %{
      id: expense.id,
      value: expense.value,
      description: expense.description,
      category: expense.category,
      user_id: expense.user_id,
      inserted_at: expense.inserted_at
    }
  end
end
