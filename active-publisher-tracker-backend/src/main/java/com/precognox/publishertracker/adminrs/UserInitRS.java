package com.precognox.publishertracker.adminrs;

import com.google.common.collect.ImmutableMultimap;
import com.precognox.publishertracker.services.UserInitService;
import io.dropwizard.servlets.tasks.Task;
import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.Path;
import java.io.PrintWriter;

@Slf4j
@Path("/")
public class UserInitRS extends Task {
    
    private final UserInitService taskService;
    
    public UserInitRS(UserInitService taskService) {
        super("init_users");
        this.taskService = taskService;
    }

    @Override
    public void execute(ImmutableMultimap<String, String> im, PrintWriter writer) throws Exception {
        taskService.initUsers().forEach(uuid -> writer.format("user added with uuid: %s", uuid));
    }

}
