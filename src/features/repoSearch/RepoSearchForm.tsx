import React, { useState, ChangeEvent, useEffect } from 'react'

import './pure-forms.css'
import './pure-buttons.css'
import {
  useCurrentPage,
  onLoadRepo,
  onPageChange,
  onShowUsers,
  INITIAL_REPO,
  INITIAL_ORG,
} from 'state'

import {
  login
} from 'api/githubAPI'

type InputEvent = ChangeEvent<HTMLInputElement>
type ChangeHandler = (e: InputEvent) => void

export const RepoSearchForm: React.FC = () => {
  const [currentOrg, setCurrentOrg] = useState(INITIAL_ORG)
  const [currentRepo, setCurrentRepo] = useState(INITIAL_REPO)
  const page = useCurrentPage()
  const [currentPageText, setCurrentPageText] = useState(page.toString())
  useEffect(() => setCurrentPageText(page.toString()), [page])

  const onOrgChanged: ChangeHandler = (e) => {
    setCurrentOrg(e.target.value)
  }

  const onRepoChanged: ChangeHandler = (e) => {
    setCurrentRepo(e.target.value)
  }

  const onCurrentPageChanged: ChangeHandler = (e) => {
    setCurrentPageText(e.target.value)
  }

  const onLoadRepoClicked = () => {
    onLoadRepo(currentOrg, currentRepo)
  }

  const onLoginClick = () => {
    login()
  }

  const onJumpToPageClicked = () => {
    const newPage = parseInt(currentPageText)

    if (newPage >= 1) {
      onPageChange(newPage)
    }
  }

  return (
    <form className="pure-form">
      <div style={{ display: 'flex' }}>
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onLoginClick}
        >
          Login
        </button>
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onShowUsers}
        >
          show Users
        </button>
      </div>
      <div>
        <label htmlFor="org" style={{ marginRight: 5 }}>
          Org:
        </label>
        <input name="org" value={currentOrg} onChange={onOrgChanged} />
        <label htmlFor="repo" style={{ marginRight: 5, marginLeft: 10 }}>
          Repo:
        </label>
        <input name="repo" value={currentRepo} onChange={onRepoChanged} />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onLoadRepoClicked}
        >
          Load Repo
        </button>
      </div>
      <div style={{ marginTop: 5 }}>
        <label htmlFor="jumpToPage" style={{ marginRight: 5 }}>
          Issues Page:
        </label>
        <input
          name="jumpToPage"
          value={currentPageText}
          onChange={onCurrentPageChanged}
        />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onJumpToPageClicked}
        >
          Jump to Page
        </button>
      </div>
    </form>
  )
}
