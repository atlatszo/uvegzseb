package com.precognox.publishertracker.rs;

import com.precognox.publishertracker.beans.AccountRB;
import com.precognox.publishertracker.beans.CreateAccountRequest;
import com.precognox.publishertracker.beans.DataOwnerFilterBean;
import com.precognox.publishertracker.beans.DataOwnerUpdateRequest;
import com.precognox.publishertracker.beans.IdAndValue;
import com.precognox.publishertracker.beans.ListSubscriptionsResult;
import com.precognox.publishertracker.enums.FilterErrorTypes;
import com.precognox.publishertracker.exceptions.ActivePublisherTrackerException;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import com.precognox.publishertracker.exceptions.NonUniqueEntityException;
import com.precognox.publishertracker.services.AccountListerService;
import com.precognox.publishertracker.services.AccountWriterService;
import com.precognox.publishertracker.services.DataOwnerService;
import com.precognox.publishertracker.services.ScraperAccountService;
import com.precognox.publishertracker.services.SubscriptionService;
import com.precognox.publishertracker.util.ExceptionMapper;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminRS {

    private final AccountListerService accountListerService;
    private final AccountWriterService accountWriterService;
    private final ScraperAccountService scraperAccountService;
    private final SubscriptionService subscriptionService;
    private final DataOwnerService dataOwnerService;

    private static final String SUBJECT_ID_HEADER_PARAM_NAME = "KEYCLOAK_SUBJECT";

    public AdminRS(
            DataOwnerService dataOwnerService,
            ScraperAccountService scraperAccountService,
            AccountListerService accountListerService,
            AccountWriterService accountWriterService,
            SubscriptionService subscriptionService) {
        this.dataOwnerService = dataOwnerService;
        this.scraperAccountService = scraperAccountService;
        this.accountListerService = accountListerService;
        this.accountWriterService = accountWriterService;
        this.subscriptionService = subscriptionService;
    }
    
    @GET
    @Path("/user")
    public String getLoggedInUserRole(@HeaderParam(SUBJECT_ID_HEADER_PARAM_NAME) String currentUserSubjectId) {
        return accountListerService.getLoggedInUser(currentUserSubjectId);
    }

    @GET
    @Path("/users")
    public List<AccountRB> listAccounts(@HeaderParam(SUBJECT_ID_HEADER_PARAM_NAME) String currentUserSubjectId) {
        return accountListerService.listAccounts(currentUserSubjectId);
    }

    @POST
    @Path("/users")
    public Response addNewAccount(
            @HeaderParam(SUBJECT_ID_HEADER_PARAM_NAME) String currentUserSubjectId, @Valid @NotNull CreateAccountRequest request) {
        try {
            accountWriterService.addNewAccount(request, currentUserSubjectId);
        } catch (ActivePublisherTrackerException ex) {
            return ExceptionMapper.mapToResponse(ex);
        }

        return Response.status(Response.Status.CREATED).build();
    }

    @POST
    @Path("/users/{accountId}")
    public Response updateUser(
            @HeaderParam(SUBJECT_ID_HEADER_PARAM_NAME) String currentUserSubjectId,
            @PathParam("accountId") int accountId,
            @Valid @NotNull CreateAccountRequest request) {
        try {
            accountWriterService.updateUser(accountId, request, currentUserSubjectId);
        } catch (ActivePublisherTrackerException ex) {
            return ExceptionMapper.mapToResponse(ex);
        }

        return Response.ok().build();
    }

    @DELETE
    @Path("/users/{accountId}")
    public Response deleteAccount(
            @HeaderParam(SUBJECT_ID_HEADER_PARAM_NAME) String currentUserSubjectId, @PathParam("accountId") int accountId) {
        try {
            accountWriterService.deleteAccount(accountId, currentUserSubjectId);
        } catch (ActivePublisherTrackerException ex) {
            return ExceptionMapper.mapToResponse(ex);
        }

        return Response.ok().build();
    }
    
    @GET
    @Path("/data-owners")
    public Response listDataOwners(
        @QueryParam("start") int start,
        @QueryParam("rows") int rows,
        @QueryParam("nameFragment") String nameFragment,
        @QueryParam("crawlerUserId") Integer crawlerUserId,
        @QueryParam("error") String error) {
            DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean(start, rows, nameFragment, crawlerUserId, error);
            return Response.ok(this.dataOwnerService.filterDataOwners(dataOwnerFilterBean)).build();
    }
    
    @POST
    @Path("/data-owners")
    public Response addDataOwner(DataOwnerUpdateRequest dataOwnerUpdateRequest) {
        try {
            dataOwnerService.addDataOwner(dataOwnerUpdateRequest);
        } catch (NonUniqueEntityException ex) {
            return ExceptionMapper.mapToResponse(ex);
        }

        return Response.status(Response.Status.OK).build();
    }
    
    @PUT
    @Path("/data-owners/{id}")
    public Response editDataOwner(@PathParam("id") int id, DataOwnerUpdateRequest dataOwnerUpdateRequest) {
        try {
            dataOwnerService.editDataOwner(dataOwnerUpdateRequest, id);
        } catch (ActivePublisherTrackerException ex) {
            return ExceptionMapper.mapToResponse(ex);
        }

        return Response.status(Response.Status.OK).build();
    }
    
    @GET
    @Path("/crawlers")
    public Response listCrawlers() {
        return Response.ok(scraperAccountService.listCrawlers()).build();
    }       
    
    @GET
    @Path("/error")
    public Response listErrors() {
        List<IdAndValue> results = Arrays.stream(FilterErrorTypes.values())
                .map(errorType -> new IdAndValue(errorType.ordinal(), errorType.name()))
                .collect(Collectors.toList());

        return Response.ok(results).build();
    }

    @GET
    @Path("/subscribers")
    public ListSubscriptionsResult listSubscriptions(@QueryParam("start") int start, @QueryParam("rows") int rows) {
        return subscriptionService.listSubscriptions(start, rows);
    }

    @DELETE
    @Path("/subscribers/{id}")
    public Response deleteSubscription(@PathParam("id") int id) {
        try {
            subscriptionService.removeSubscriptionByAdmin(id);
        } catch (EntityNotFoundException ex) {
            return ExceptionMapper.mapToResponse(ex);
        }

        return Response.ok().build();
    }

    @GET
    @Path("/scrapers")
    public Response listScraperAccounts(@QueryParam("start") int start, @QueryParam("rows") int rows) {
        return Response.ok(scraperAccountService.listScraperAccounts(start, rows)).build();
    }

}
