defmodule Anotagasto.Expenses.Repo do
  alias Anotagasto.Expenses.Expense
  alias Anotagasto.Repo

  def list_expenses_by_user(user_id) do
    Repo.all_by(Expense, user_id: user_id)
  end
end
