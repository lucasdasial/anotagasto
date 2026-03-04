defmodule Anotagasto.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Anotagasto.Pagination
  alias Anotagasto.Repo

  alias Anotagasto.Accounts.User

  def list_users(%Pagination{} = pagination) do
    Repo.paginate(User, pagination)
  end

  def list_users() do
    with {:ok, pagination} <- Pagination.build() do
      list_users(pagination)
    end
  end

  def get_user!(id), do: Repo.get!(User, id)

  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end
end
