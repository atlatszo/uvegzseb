package com.precognox.publishertracker.rs;

import com.precognox.publishertracker.beans.SubscribeRequest;
import com.precognox.publishertracker.beans.UnsubscribeRequest;
import com.precognox.publishertracker.services.DataOwnerService;
import com.precognox.publishertracker.services.RankingService;
import com.precognox.publishertracker.services.SubscriptionService;
import com.precognox.publishertracker.services.UpdateService;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/public")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PublicRS {

    private final DataOwnerService dataOwnerService;
    private final UpdateService updateService;
    private final SubscriptionService subscriptionService;
    private final RankingService rankingService;

    public PublicRS(
            DataOwnerService dataOwnerService, UpdateService updateService, SubscriptionService subscriptionService, RankingService rankingService) {
        this.dataOwnerService = dataOwnerService;
        this.updateService = updateService;
        this.subscriptionService = subscriptionService;
        this.rankingService = rankingService;
    }
    
    @GET
    @Path("/echo")
    public String echo() {
        return "Active Publisher Tracker Backend";
    }
    
    @GET
    @Path("/data-owners")
    public Response listDataOwners() {
        return Response.ok(dataOwnerService.getDataOwnerDropdownData()).build();
    }

    @POST
    @Path("/subscribers")
    public Response addSubscriber(@Valid @NotNull SubscribeRequest request) {
        subscriptionService.addSubscription(request.getEmail());

        return Response.status(Response.Status.CREATED).build();
    }

    @DELETE
    @Path("/subscribers")
    public Response removeSubscriber(@Valid @NotNull UnsubscribeRequest request) {
        subscriptionService.removeSubscription(request.getEmail(), request.getToken());

        return Response.ok().build();
    }
    
    @GET
    @Path("/categories")
    public Response listCategories() {
        return Response.ok(updateService.listCategories()).build();
    }
    
    @GET
    @Path("/updates")
    public Response listUpdates(
        @QueryParam("start") int start,
        @QueryParam("rows") int rows,
        @QueryParam("dataOwnerNameFragment") String dataOwnerNameFragment,
        @QueryParam("categoryId") List<Integer> categoryIds) {
        return Response.ok(updateService.listUpdates(start, rows, dataOwnerNameFragment, categoryIds)).build();        
    }

    @GET
    @Path("/ranking")
    public Response getRanking(@QueryParam("start") int start, @QueryParam("rows") int rows) {
        return Response.ok(rankingService.getRankings(start, rows)).build();
    }

}
