# API Reference — Anota Gasto

API JSON pura. Todas as rotas protegidas exigem `Authorization: Bearer <token>`.

---

## Autenticação

### `POST /api/register`
Cria uma conta.

```json
// request
{ "name": "Ana", "phone_number": "11999999999", "password": "senha123" }

// response 201
{ "data": { "id": "...", "name": "Ana", "phone_number": "11999999999" } }
```

### `POST /api/auth`
Faz login e retorna um token JWT (TTL: 1 dia).

```json
// request
{ "phone_number": "11999999999", "password": "senha123" }

// response 200
{ "token": "eyJ..." }
```

---

## Despesas

Todas as rotas abaixo são protegidas.

### `GET /api/expenses`
Lista as despesas do usuário autenticado com paginação e filtros.

**Query params:**

| Param      | Tipo      | Descrição                               |
| ---------- | --------- | --------------------------------------- |
| `month`    | `YYYY-MM` | Filtra pelo mês de criação              |
| `category` | `string`  | Filtra por categoria (ver enum abaixo)  |
| `search`   | `string`  | Busca parcial na descrição              |
| `page`     | `integer` | Página (default: 1)                     |
| `page_size`| `integer` | Itens por página (default: 20, max: 100)|

```json
// response 200
{
  "data": [
    {
      "id": "...",
      "value": "85.90",
      "description": "Mercado Extra",
      "category": "food",
      "inserted_at": "2026-03-15T14:00:00Z"
    }
  ],
  "pagination": { "page": 1, "page_size": 20, "total": 45, "total_pages": 3 }
}
```

### `GET /api/expenses/:id`
Retorna uma despesa específica.

### `POST /api/expenses`
Cria uma despesa.

```json
// request
{ "value": 85.90, "description": "Mercado Extra", "category": "food" }

// response 201
{ "data": { "id": "...", ... } }
```

### `PATCH /api/expenses/:id`
Atualiza campos de uma despesa.

```json
// request
{ "expense": { "value": 90.00 } }
```

### `DELETE /api/expenses/:id`
Remove uma despesa. Retorna `204 No Content`.

**Enum de categorias:**
`grocery` `eat_out` `cleaning_products` `health` `medicines` `housing` `subscriptions`
`transport_public` `transport_apps` `education` `shopping` `clothing` `debts` `leisure` `beauty` `uncategorized`

---

## Analytics

Todas as rotas abaixo são protegidas. O parâmetro `month` é opcional — sem ele, usa o mês atual.

### `GET /api/analytics/summary`
Resumo financeiro do mês: total, quantidade e distribuição por categoria.

```json
// response 200
{
  "data": {
    "month": "2026-03",
    "total": "1250.00",
    "count": 23,
    "by_category": [
      { "category": "food",      "total": "450.00", "count": 8 },
      { "category": "transport", "total": "200.00", "count": 5 }
    ]
  }
}
```

`by_category` vem ordenado por `total` decrescente. Categorias sem despesas no mês são omitidas.

### `GET /api/analytics/daily`
Total de gastos por dia do mês. Retorna apenas dias com ao menos uma despesa.

```json
// response 200
{
  "data": {
    "month": "2026-03",
    "days": [
      { "date": "2026-03-01", "total": "85.00",  "count": 2 },
      { "date": "2026-03-15", "total": "230.00", "count": 1 }
    ]
  }
}
```

> Para ver as despesas de um dia específico, use `GET /api/expenses?month=YYYY-MM` e filtre no cliente.

### `GET /api/analytics/monthly` _(a implementar)_
Histórico dos últimos 12 meses.

### `GET /api/analytics/compare` _(a implementar)_
Comparação entre dois meses.

**Query params:** `month1=YYYY-MM`, `month2=YYYY-MM`

### `GET /api/analytics/category-evolution` _(a implementar)_
Evolução de gastos por categoria ao longo de N meses.

**Query params:** `months=6` (default: 6)

---

## Erros

| Status | Quando                                    |
| ------ | ----------------------------------------- |
| `401`  | Token ausente ou inválido                 |
| `404`  | Recurso não encontrado                    |
| `422`  | Parâmetros inválidos (detalhe nos errors) |

```json
// 422
{ "errors": { "month": ["must be in YYYY-MM format"] } }
```

---

## Decisões de design

- `user_id` nunca é aceito no body — sempre extraído do token para evitar privilege escalation
- Changesets com `apply_action(:validate)` para validação prévia sem persistir
- `FallbackController` centraliza todos os erros — actions retornam tuplas `{:ok, _}` / `{:error, _}`
- Contexto `Anotagasto.Expenses.Analytics` é subdomínio de Expenses (só lê da tabela `expenses`)
- Rotas de analytics unificadas em `/api/analytics/*` — sem distinção dashboard/reports (conceito de UI, não de API)
