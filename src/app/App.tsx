import React from 'react'
import './App.css'
import { RepoSearchForm } from 'features/repoSearch/RepoSearchForm'
import { IssuesListPage } from 'features/issuesList/IssuesListPage'
import { IssueDetailsPage } from 'features/issueDetails/IssueDetailsPage'
import Users from 'features/users'
import { useSelectedIssueId, useShowUsers } from 'state'

const List: React.FC = () => {
  const selectedIssueId = useSelectedIssueId()
  const showUsers = useShowUsers()
  if (showUsers) {
    return <Users />
  }
  if (!selectedIssueId)
    return (
      <>
        <RepoSearchForm />
        <IssuesListPage />
      </>
    )
  return null
}

const App: React.FC = () => (
  <div className="App">
    <List />
    <IssueDetailsPage />
  </div>
)

export default App
