package com.precognox.publishertracker.rs;

import com.precognox.publishertracker.beans.ScrapedDataRB;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import com.precognox.publishertracker.services.DataService;
import com.precognox.publishertracker.util.ExceptionMapper;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 *
 * @author precognox
 */
@Path("/api")
public class ScraperRS {
    
    private final DataService dataService;

    public ScraperRS(DataService dataService) {
        this.dataService = dataService;
    }

    @GET
    @Path("/echo")
    public Response echo() {
        return Response.ok("Active Publisher Tracker API").build();
    }
    
    @POST
    @Path("/save-scraped-data")
    public Response saveScrapedData(@HeaderParam("KEYCLOAK_SUBJECT_ID") String currentUserUuid, List<ScrapedDataRB> scrapedDataRBs) {
        try {
            dataService.saveScrapedData(scrapedDataRBs, currentUserUuid);
        } catch (EntityNotFoundException ex) {
            return ExceptionMapper.mapToResponse(ex);
        }

        return Response.status(Response.Status.ACCEPTED).build();
    }
    
}
