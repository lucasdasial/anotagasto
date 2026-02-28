defmodule AnotagastoWeb.ExpenseControllerTest do
  use AnotagastoWeb.ConnCase

  import Anotagasto.ExpensesFixtures
  alias Anotagasto.Expenses.Expense

  @create_attrs %{
    value: 42,
    description: "some description",
    category: :food,
    user_id: "7488a646-e31f-11e4-aace-600308960662"
  }
  @update_attrs %{
    value: 43,
    description: "some updated description",
    category: :eat_out,
    user_id: "7488a646-e31f-11e4-aace-600308960668"
  }
  @invalid_attrs %{value: nil, description: nil, category: nil, user_id: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all expenses", %{conn: conn} do
      conn = get(conn, ~p"/api/expenses")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create expense" do
    test "renders expense when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/expenses", expense: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/expenses/#{id}")

      assert %{
               "id" => ^id,
               "category" => "food",
               "description" => "some description",
               "user_id" => "7488a646-e31f-11e4-aace-600308960662",
               "value" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/expenses", expense: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update expense" do
    setup [:create_expense]

    test "renders expense when data is valid", %{conn: conn, expense: %Expense{id: id} = expense} do
      conn = put(conn, ~p"/api/expenses/#{expense}", expense: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/expenses/#{id}")

      assert %{
               "id" => ^id,
               "category" => "eat_out",
               "description" => "some updated description",
               "user_id" => "7488a646-e31f-11e4-aace-600308960668",
               "value" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, expense: expense} do
      conn = put(conn, ~p"/api/expenses/#{expense}", expense: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete expense" do
    setup [:create_expense]

    test "deletes chosen expense", %{conn: conn, expense: expense} do
      conn = delete(conn, ~p"/api/expenses/#{expense}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/expenses/#{expense}")
      end
    end
  end

  defp create_expense(_) do
    expense = expense_fixture()

    %{expense: expense}
  end
end
