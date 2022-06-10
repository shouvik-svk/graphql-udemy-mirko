import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { request } from "graphql-request";
import { getAccessToken } from '../auth';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache()
});

export async function getAllJobs() {
  const query = gql`
    query GetAllJobs {
      jobs {
        id,
        title,
        description
        company {
          name
        }
      }
    }
  `
  const { jobs } = await request(GRAPHQL_URL, query);
  return jobs;
}

export async function getJobById(id) {
  const query = gql`
    query GetJobById($jobId: ID!) {
      job(id: $jobId) {
        title
        description
        company {
          id
          name
        }
      }
    }
  `

  const variables = { jobId: id };
  const { job } = await request(GRAPHQL_URL, query, variables);
  return job;
}

export async function getCompanyById(id) {
  const query = gql`
    query GetCompanyById($companyId: ID!) {
      company(id: $companyId) {
        name,
        description,
        jobs {
          id
          title
          description
        }
      }
    }
  `

  const variables = { companyId: id };
  const { company } = await request(GRAPHQL_URL, query, variables);
  return company;
}

export async function createJob(createJobInput) {
  const query = gql`
    mutation CreateJob($createJobInput: CreateJobInput!) {
      job: createJob(createJobInput: $createJobInput) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `

  const variables = { createJobInput: createJobInput };
  const headers = { Authorization: `Bearer ${getAccessToken()}`}
  const { job } = await request(GRAPHQL_URL, query, variables, headers);
  return job;
}